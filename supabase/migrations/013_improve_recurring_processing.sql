-- Improve process_recurring_transactions to handle catch-up and return count
CREATE OR REPLACE FUNCTION process_recurring_transactions()
RETURNS INTEGER AS $$
DECLARE
  rec RECORD;
  processed_count INTEGER := 0;
  next_date DATE;
BEGIN
  -- Iterate through all active recurring transactions that are due
  FOR rec IN 
    SELECT * FROM recurring_transactions 
    WHERE is_active = TRUE 
      AND next_occurrence <= CURRENT_DATE
  LOOP
    next_date := rec.next_occurrence;
    
    -- Loop to catch up on missed occurrences
    WHILE next_date <= CURRENT_DATE AND (rec.end_date IS NULL OR next_date <= rec.end_date) LOOP
      -- Create the transaction
      INSERT INTO transactions (
        user_id,
        account_id,
        category_id,
        type,
        title,
        amount,
        date,
        description
      ) VALUES (
        rec.user_id,
        rec.account_id,
        rec.category_id,
        rec.type,
        rec.title,
        rec.amount,
        next_date,
        COALESCE(rec.description, '') || ' (Recorrente)'
      );
      
      processed_count := processed_count + 1;
      
      -- Calculate next date for the next iteration
      next_date := calculate_next_occurrence(next_date, rec.frequency);
    END LOOP;

    -- Update the recurring transaction record with the final next_date
    UPDATE recurring_transactions
    SET 
      next_occurrence = next_date,
      updated_at = NOW(),
      is_active = CASE 
        WHEN rec.end_date IS NOT NULL AND next_date > rec.end_date THEN FALSE 
        ELSE is_active 
      END
    WHERE id = rec.id;
    
  END LOOP;
  
  RETURN processed_count;
END;
$$ LANGUAGE plpgsql;
