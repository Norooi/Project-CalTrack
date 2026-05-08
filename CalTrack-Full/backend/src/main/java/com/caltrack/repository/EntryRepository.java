package com.caltrack.repository;

import com.caltrack.model.Entry;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EntryRepository extends MongoRepository<Entry, String> {
    List<Entry> findByDate(LocalDate date);
}
