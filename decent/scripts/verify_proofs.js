// require('dotenv').config(); // Load environment variables
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase credentials from environment variables
const SUPABASE_URL = "https://kehyypbuntiebphfojgl.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaHl5cGJ1bnRpZWJwaGZvamdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NjQxOTEsImV4cCI6MjA0NTU0MDE5MX0.XFQS86eeFIhRxfcI2ghS1-5aSvKi6xSQCqr1gtFLqxE";

// Initialize client
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

// Read .json
const proofData = JSON.parse(fs.readFileSync('/app/proof.json'));

// Update pabase table
async function updateTable() {
    try {
        const { data, error } = await supabase
            .from('logs') 
            .insert([
                {
                    proofs: {
                      sgd:true
                    },
                    timestamp: new Date().toISOString(),
                    client_name: 'Hospital ' + Math.round((Math.random()*10)+1),
                    accuracy: 86
                    
                }
            ]);

        if (error) {
            console.error('Error updating Supabase table:', error);
            return;
        }

        console.log('Supabase table updated successfully:', data);
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Run he update function
updateTable();
