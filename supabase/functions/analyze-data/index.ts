import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file_data, file_name, file_type } = await req.json();

    console.log(`Processing file: ${file_name} (${file_type})`);

    // Simulate processing with mock data
    // In a real implementation, you would:
    // 1. Parse the CSV/Excel file
    // 2. Perform data cleaning and type inference
    // 3. Generate ERD
    // 4. Create visualizations
    // 5. Generate dashboard code

    // Mock response data
    const mockResults = {
      cleaned_csv_base64: file_data, // In reality, this would be the cleaned version
      sql_schema: generateMockSchema(file_name),
      erd_svg_base64: generateMockERD(),
      report_text: generateMockReport(file_name),
      analysis_json: {
        issues_found: "3 duplicate rows, 5 columns with missing values",
        actions_taken: "Removed duplicates, filled missing values using median/mode",
        missing_value_summary: "Total missing: 45 cells across 5 columns",
        suspected_primary_keys: ["id", "customer_id"],
        suspected_foreign_keys: ["product_id", "category_id"],
        recommended_charts: [
          "Time series for sales trends",
          "Bar chart for category distribution",
          "Correlation heatmap for numeric fields"
        ]
      }
    };

    return new Response(JSON.stringify(mockResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateMockSchema(filename: string): string {
  return `-- Generated schema for ${filename}

CREATE TABLE sales_data (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  sale_date DATE NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  region VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_id ON sales_data(customer_id);
CREATE INDEX idx_product_id ON sales_data(product_id);
CREATE INDEX idx_sale_date ON sales_data(sale_date);

-- Add foreign key constraints if related tables exist
-- ALTER TABLE sales_data ADD CONSTRAINT fk_customer 
--   FOREIGN KEY (customer_id) REFERENCES customers(id);
`;
}

function generateMockERD(): string {
  // This would generate an actual SVG ERD in a real implementation
  // For now, return a simple base64 encoded placeholder
  const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="50" width="300" height="200" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="2" rx="8"/>
    <text x="200" y="90" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold">sales_data</text>
    <line x1="50" y1="100" x2="350" y2="100" stroke="#0ea5e9" stroke-width="1"/>
    <text x="70" y="130" font-family="Arial" font-size="14">• id (PK)</text>
    <text x="70" y="155" font-family="Arial" font-size="14">• customer_id</text>
    <text x="70" y="180" font-family="Arial" font-size="14">• product_id</text>
    <text x="70" y="205" font-family="Arial" font-size="14">• sale_date</text>
    <text x="70" y="230" font-family="Arial" font-size="14">• total_amount</text>
  </svg>`;
  return btoa(svg);
}

function generateMockReport(filename: string): string {
  return `Data Analysis Report for ${filename}
========================================

File Analysis Summary:
- Total Rows: 1,250
- Total Columns: 8
- Data Types Detected: 3 numeric, 2 categorical, 2 date, 1 ID

Data Quality Assessment:
✓ Encoding: UTF-8
✓ Delimiter: Comma (,)
✓ Header Row: Detected on row 1

Data Cleaning Actions:
1. Removed 3 duplicate rows (0.24% of data)
2. Filled 45 missing values across 5 columns
   - Numeric columns: Filled with median
   - Categorical columns: Filled with mode
3. Normalized date formats to YYYY-MM-DD
4. Removed currency symbols and standardized numeric values

Column Type Inference:
- id: Integer (Primary Key candidate)
- customer_id: Integer (Foreign Key candidate)
- product_id: Integer (Foreign Key candidate)
- sale_date: Date
- quantity: Integer
- unit_price: Float
- total_amount: Float
- category: Categorical
- region: Categorical

Relationships Detected:
- Primary Key: id (100% unique)
- Potential Foreign Keys:
  * customer_id (references external customers table)
  * product_id (references external products table)

Key Insights:
• Sales trend shows 15% growth over the period
• Top 3 categories account for 65% of total revenue
• Regional distribution is uneven with 40% concentration in one area
• Average transaction value: $142.50
• Peak sales period: Q4

Recommended Next Steps:
1. Review the generated SQL schema for accuracy
2. Examine the ERD for relationship validation
3. Download the cleaned dataset for further analysis
4. Use the generated dashboard for interactive exploration
5. Consider creating separate dimension tables for customers and products

Data Quality Score: 94/100
- Completeness: 96%
- Consistency: 95%
- Accuracy: 92%
`;
}
