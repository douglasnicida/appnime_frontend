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
  
export function PaginationComponent({setChanged, changed, maxPage}: PaginationProps) {
    const params = new URLSearchParams(window.location.search);

    const [page, setPage] = useState<number>(Number(params.get('page')))

    useEffect(() => {
        setPage(Number(params.get('page')))
    }, [])

    const handleNextPage = () => {
        if(page < maxPage) {
            updateSearchParams({ page: String(page + 1) });
            setChanged(!changed)
        }
    };

    const handleUpdatePage = (current: number) => {
        updateSearchParams({ page: String(current) });
        setChanged(!changed)
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            updateSearchParams({ page: String(page - 1) });
            setChanged(!changed)
        }
    };

    useEffect(() => {
        setPage(Number(params.get('page')));
    }, [handleNextPage, handlePreviousPage])

    return (
        <Pagination>
        <PaginationContent>
            <PaginationItem>
                <PaginationPrevious onClick={handlePreviousPage}/>
            </PaginationItem>

            <PaginationItem onClick={() => {handleUpdatePage((page == 1) ? 1 : page - 1)}}>
                <PaginationLink isActive={page == 1}>{page == 1 ? 1 : page - 1}</PaginationLink>
            </PaginationItem>

            {
                maxPage!=1 &&

                <PaginationItem onClick={() => {handleUpdatePage((page == 1) ? 2 : page)}}>
                    <PaginationLink isActive={page != 1 && page < maxPage}>
                        {(page == 1) ? 2 : page}
                    </PaginationLink>
                </PaginationItem>
            }

            {
                page < maxPage &&
                <PaginationItem onClick={() => {handleUpdatePage((page == 1) ? 3 : page + 1)}}>
                    <PaginationLink>{(page == 1) ? 3 : page + 1}</PaginationLink>
                </PaginationItem>
            }
            
            <PaginationItem className="cursor-default">
                <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem onClick={handleNextPage}>
                <PaginationNext/>
            </PaginationItem>

        </PaginationContent>
        </Pagination>
    )
}
  