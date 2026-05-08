package com.caltrack.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "entries")
public class Entry {

    @Id
    private String id;
    private String name;
    private int calories;
    private String type;
    private LocalDate date;
    private LocalDateTime createdAt;
}
