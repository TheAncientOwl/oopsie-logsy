/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file useSyncTableWidths.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Sync table widths when new data is displayed.
 */

import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useRef } from 'react';

// TODO: compute default column widths on backend
export const useSyncTableWidths = (resizeDeps: React.DependencyList) => {
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  const syncWidths = () => {
    if (!headerRef.current || !bodyRef.current) return;

    const headerCells = headerRef.current.querySelectorAll('th');
    const firstBodyRow = bodyRef.current.querySelector('tr');
    if (!firstBodyRow) return;
    const bodyCells = firstBodyRow.querySelectorAll('td');

    console.assertX(
      useSyncTableWidths,
      headerCells.length === bodyCells.length,
      `Logic error, header cells count(${headerCells.length}) != body cells count(${bodyCells.length})`
    );

    bodyCells.forEach((td, index) => {
      const width = td.getBoundingClientRect().width + 'px';
      headerCells[index].style.width = width;
    });
  };

  useEffect(() => {
    syncWidths();
    window.addEventListener('resize', syncWidths);

    return () => window.removeEventListener('resize', syncWidths);
  }, resizeDeps);

  const syncWidthsDebounced = useDebounce(syncWidths, 100);

  return { headerRef, bodyRef, syncWidthsDebounced };
};
