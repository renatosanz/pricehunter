import { getUserDataTable, type UserDataTable } from "@/services/admin-service";
import { useEffect, useState } from "react";
import useDebounce from "./useDebounced";

export default function useUserDataTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearchTerm = useDebounce(searchTerm, 300);
  const [usersData, setUsersData] = useState<UserDataTable>({
    success: true,
    users: [],
    pagination: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: 0,
    },
  });

  const fetchData = (page: number, page_size: number, searchTerm: string) => {
    getUserDataTable(page, page_size, searchTerm).then((data) => {
      setUsersData(data);
    });
  };

  useEffect(() => {
    fetchData(pageSize, page, debounceSearchTerm);
  }, [pageSize, page, debounceSearchTerm]);

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const nextPage = () => {
    if (pageSize * page < usersData.pagination.totalItems) {
      setPage(page + 1);
    }
  };

  return {
    usersData,
    nextPage,
    previousPage,
    setPageSize,
    pageSize,
    page,
    setSearchTerm,
  };
}
