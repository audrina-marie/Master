import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { fetchData } from "../../common/Util/DataProviderUtil";
import { AgGridReact } from "ag-grid-react";
import _ from "lodash";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { remarksLookupUrl } from "./common/lookupUrls";

const Sf52RemarkSearch = ({ handleClick, remarks }) => {
  const [remarkCode, setRemarkCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [query, setQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([{ field: "code", checkboxSelection: true }, { field: "remark", flex: 1 }]);
  const [selectedRows, setSelectedRows] = useState([]);

  const clearRef = useRef(null);

  const defaultColDef = {
    filter: true,
    sortable: true,
    resizable: true,
  };

  const gridOptions = useMemo(() => ({
    rowSelection: 'multiple',
    onGridReady: (params) => {
      setGridApi(params.api); 
    },
  }), []);

  useEffect(() => {
    if (gridApi) {
      gridApi.forEachNode((node) => {
        const isSelected = remarks.some(row => row.code === node.data.code);
        if (isSelected) {
          node.setSelected(true);
        }
      });
    }
  }, [remarks, gridApi]);

  const debouncedSearch = useMemo(
    () =>
      _.debounce((searchQuery) => {
        setQuery(searchQuery);
      }, 500),
    [query],
  );

  const handleChange = (e) => debouncedSearch(e.target.value);
  const handleClose = () => {
    setQuery("");
    setIsOpen(false);
  };
  const handleOpen = () => setIsOpen(true);
  const handleClear = () => {
    clearRef.current.value = "";
    setQuery("");
    setSelectedRows({});
    gridApi.deselectAll();
  };
  const handleSelection = () => {
    handleClick(selectedRows)
    handleClose();
  };

  useEffect(() => {
    const getRemarks = async () => {
      const remarksRes = await fetchData(remarksLookupUrl + `${remarkCode}`);
      const remarksEntries = Object.entries(remarksRes);
      const formattedRemarksData = remarksEntries.map((e) => ({ code: e[0], remark: e[1] }));
      setRowData(formattedRemarksData);
    };
    getRemarks();
  }, []);

  return (
    <>
      <Button onClick={handleOpen}>Search</Button>
      <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg" fullWidth={true}>
        <DialogContent>
          <input type="text" defaultValue={query} ref={clearRef} onChange={handleChange} placeholder="Search..." />
          <button onClick={handleClear}>Clear</button>
          <div className="ag-theme-alpine" style={{ height: 500 }}>
            <AgGridReact
              overlayNoRowsTemplate={"<span>Loading...</span>"}
              pagination
              paginationAutoPageSize
              gridOptions={gridOptions}
              onSelectionChanged={(s) => {
                const rows = s.api.getSelectedRows();
                setSelectedRows(rows);
              }}
              rowData={rowData}
              defaultColDef={defaultColDef}
              columnDefs={colDefs}
              quickFilterText={query}
              cacheQuickFilter={true}
            />
          </div>
          <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSelection}>
              Ok
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sf52RemarkSearch;
