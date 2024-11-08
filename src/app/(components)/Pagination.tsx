'use client'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
  
  export const updateSearchParams = (newParams: Record<string, string>) => {
    // Obter os parâmetros de consulta atuais
    const currentParams = new URLSearchParams(window.location.search);

    // Atualizar os parâmetros com os novos valores
    Object.entries(newParams).forEach(([key, value]) => {
        currentParams.set(key, value);
    });

    // Atualizar a URL com os novos parâmetros de consulta
    const newQueryString = currentParams.toString();
    window.history.pushState({}, '', `?${newQueryString}`);
};

interface PaginationProps {
    setChanged: Dispatch<SetStateAction<boolean>>
    changed: any
    maxPage: number
}

export function PaginationComponent({ setChanged, changed, maxPage }: PaginationProps) {
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const windowParams = new URLSearchParams(window.location.search);
        const pageParam = windowParams.get('page');
        setPage(pageParam ? Number(pageParam) : 1);
    }, [changed]);

    const updatePage = (newPage: number) => {
        if (newPage >= 1 && newPage <= maxPage) {
            updateSearchParams({ page: String(newPage) });
            setPage(newPage); // Atualizar o estado local
            setChanged(!changed);
        }
    };

    const handleNextPage = () => {
        updatePage(page + 1);
    };

    const handlePreviousPage = () => {
        updatePage(page - 1);
    };

    const handleUpdatePage = (current: number) => {
        updatePage(current);
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={handlePreviousPage} />
                </PaginationItem>

                <PaginationItem onClick={() => handleUpdatePage(page === 1 ? 1 : page - 1)}>
                    <PaginationLink isActive={page === 1}>{page === 1 ? 1 : page - 1}</PaginationLink>
                </PaginationItem>

                {maxPage !== 1 && (
                    <PaginationItem onClick={() => handleUpdatePage(page === 1 ? 2 : page)}>
                        <PaginationLink isActive={page !== 1 && page < maxPage}>
                            {page === 1 ? 2 : page}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {page < maxPage && (
                    <PaginationItem onClick={() => handleUpdatePage(page === 1 ? 3 : page + 1)}>
                        <PaginationLink>{page === 1 ? 3 : page + 1}</PaginationLink>
                    </PaginationItem>
                )}

                <PaginationItem className="cursor-default">
                    <PaginationEllipsis />
                </PaginationItem>

                <PaginationItem onClick={handleNextPage}>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
  