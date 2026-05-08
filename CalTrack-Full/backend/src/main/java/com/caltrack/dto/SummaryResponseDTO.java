package com.caltrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryResponseDTO {
    private int totalConsumed;
    private int totalBurned;
    private int netCalories;
}
