package com.example.ecommerce.config;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSchemaFixer implements ApplicationRunner {

    private static final Logger LOGGER = Logger.getLogger(DatabaseSchemaFixer.class.getName());
    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            dropUniqueOrderUserIndexes();
        } catch (Exception e) {
            LOGGER.warning("Skipping schema fix for orders.user_id: " + e.getMessage());
        }
    }

    private void dropUniqueOrderUserIndexes() {
        try {
            String sql = """
                    SELECT INDEX_NAME
                    FROM information_schema.statistics
                    WHERE table_schema = DATABASE()
                      AND table_name = 'orders'
                      AND column_name = 'user_id'
                      AND non_unique = 0
                      AND index_name <> 'PRIMARY'
                    """;

            List<String> indexNames = jdbcTemplate.queryForList(sql, String.class);

            for (String indexName : indexNames) {
                try {
                    jdbcTemplate.execute("ALTER TABLE orders DROP INDEX " + indexName);
                } catch (Exception e) {
                    LOGGER.info("Skipping index " + indexName + " on orders.user_id: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            LOGGER.warning("Error in dropUniqueOrderUserIndexes: " + e.getMessage());
        }
    }
}
