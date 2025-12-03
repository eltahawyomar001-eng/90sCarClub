export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Upload to Vercel Blob using REST API
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    const fileName = `${Date.now()}-${file.name}`;
    
    const uploadResponse = await fetch(
      `https://blob.vercel-storage.com/${fileName}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${blobToken}`,
          'Content-Type': file.type,
          'x-content-type': file.type,
        },
        body: await file.arrayBuffer(),
      }
    );

    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }

    const result = await uploadResponse.json();
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
