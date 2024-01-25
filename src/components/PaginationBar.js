import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useDispatch } from "react-redux";
import { setPageNum } from "../bookStoreSlice";

const PaginationBar = ({ pageNum, totalPageNum }) => {
  const dispatch = useDispatch();
  const handleChange = (event, value) => {
    dispatch(setPageNum(value));
  };
  return (
    <Stack spacing={2}>
      <Pagination
        count={totalPageNum}
        page={pageNum}
        onChange={handleChange}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
};

export default PaginationBar;
