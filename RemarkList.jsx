import React from "react";
import RemarkListItem from "./RemarkListItem";

const RemarkList = ({ handleClick, result }) => {

    const listItems = Object.entries(result).map(item => {
        return <RemarkListItem key={item[0]} item={item} handleClick={handleClick} />
    });

  return <ul>{listItems}</ul>;
};

export default RemarkList;
