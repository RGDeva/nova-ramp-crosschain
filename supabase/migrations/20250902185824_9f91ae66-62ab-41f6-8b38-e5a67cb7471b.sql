-- Fix the trigger for deposits table
create trigger update_deposits_updated_at
  before update on deposits
  for each row execute function update_updated_at_column();