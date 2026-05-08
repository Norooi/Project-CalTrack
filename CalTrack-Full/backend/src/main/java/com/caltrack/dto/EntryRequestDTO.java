package com.caltrack.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntryRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Calories is required")
    @Min(value = 0, message = "Calories must be 0 or greater")
    private Integer calories;

    @NotBlank(message = "Type is required")
    @Pattern(regexp = "MEAL|WORKOUT", message = "Type must be MEAL or WORKOUT")
    private String type;

    @NotNull(message = "Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
}
