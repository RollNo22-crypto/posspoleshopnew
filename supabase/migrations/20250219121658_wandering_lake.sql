/*
  # Remove Checkout RLS Policies

  1. Changes
    - Drop RLS policies for rfq_requests table
    - Disable RLS for rfq_requests table to allow checkout

  2. Security
    - Remove RLS restrictions for checkout process
    - Note: This should be carefully considered in production environments
*/

-- Drop existing RFQ policies
DROP POLICY IF EXISTS "rfq_select_policy" ON rfq_requests;
DROP POLICY IF EXISTS "rfq_insert_policy" ON rfq_requests;
DROP POLICY IF EXISTS "rfq_update_policy" ON rfq_requests;
DROP POLICY IF EXISTS "rfq_delete_policy" ON rfq_requests;

-- Disable RLS on rfq_requests table
ALTER TABLE rfq_requests DISABLE ROW LEVEL SECURITY;