package com.reservo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

/**
 * Standard generic response wrapper for paginated API results.
 *
 * @param <T> The element type contained in the page content.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponseDTO<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;

    public static <T> PageResponseDTO<T> of(List<T> allItems, Integer pageNumber, Integer pageSize) {
        if (allItems == null || allItems.isEmpty()) {
            return PageResponseDTO.<T>builder()
                    .content(Collections.emptyList())
                    .page(0)
                    .size(pageSize != null && pageSize > 0 ? pageSize : 10)
                    .totalElements(0)
                    .totalPages(0)
                    .first(true)
                    .last(true)
                    .build();
        }

        int total = allItems.size();
        int page = (pageNumber != null && pageNumber >= 0) ? pageNumber : 0;
        int size = (pageSize != null && pageSize > 0) ? pageSize : total;

        int totalPages = (int) Math.ceil((double) total / size);
        int fromIndex = Math.min(page * size, total);
        int toIndex = Math.min(fromIndex + size, total);

        List<T> slice = (fromIndex < toIndex) ? allItems.subList(fromIndex, toIndex) : Collections.emptyList();

        return PageResponseDTO.<T>builder()
                .content(slice)
                .page(page)
                .size(size)
                .totalElements(total)
                .totalPages(totalPages)
                .first(page == 0)
                .last(page >= totalPages - 1)
                .build();
    }
}
