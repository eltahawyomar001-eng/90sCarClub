import { createClient } from '@vercel/kv';

// Initialize KV client with custom prefix
const kv = createClient({
  url: process.env.BVCC_KV_REST_API_URL,
  token: process.env.BVCC_KV_REST_API_TOKEN,
});

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET - Retrieve content
    if (request.method === 'GET') {
      const content = await kv.get('bvcc_content');
      
      return new Response(JSON.stringify({
        success: true,
        content: content || getDefaultContent()
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // POST - Save content
    if (request.method === 'POST') {
      const body = await request.json();
      const { password, token, content } = body;

      // Get admin password from environment variable
      const adminPassword = process.env.BVCC_ADMIN_PASSWORD || 'bvcc2024';

      // Check authentication - either password or valid token
      const isAuthenticated = password === adminPassword || (token && token.length === 64);

      if (!isAuthenticated) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid password or token'
        }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Save to Redis
      await kv.set('bvcc_content', content);

      return new Response(JSON.stringify({
        success: true,
        message: 'Content saved successfully'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Default content fallback
function getDefaultContent() {
  return {
    hero: {
      tag: "Brooklyn, NY — Members Only",
      title1: "Your private",
      title2: "drivers' club.",
      subtitle: "Analog-era performance. Modern classics.<br>A minimalist, industrial space built for people who love to drive."
    },
    about: {
      title: "Quiet. Minimal.<br><em>Practical.</em>",
      lead: "Brooklyn Vintage Car Club is a small, private drivers' club centered on analog, modern-classic cars from the 1990s and 2000s.",
      p1: "The emphasis is driving—quiet, minimal, and practical. A clean industrial space, a curated fleet, frictionless access, and a small membership base that appreciates substance over spectacle.",
      p2: "The space includes a simple lounge with a low-key, self-serve bar, lockers, and room to decompress before or after drives. Built for people who value engagement, analog feel, and the clarity of mechanical controls."
    },
    location: {
      title: "Brooklyn.<br><em>Industrial.</em>",
      lead: "The club will be located in either Red Hook or Sunset Park—Brooklyn neighborhoods defined by industrial buildings, wide blocks, and easy vehicle access.",
      text: "Both areas have the right architecture and access for a drivers' club."
    },
    fleet: {
      title: "Driver-focused<br><em>machines</em>",
      intro: "A curated set of 90s and 2000s European modern classics—driver-focused machines known for character, engagement, and analog feel.",
      listTitle: "Representative Fleet List",
      details: "Launch with 8–10 cars, grow to 12 by the end of year two, and expand to 18 as membership scales.",
      carList: "<p><strong>Porsche:</strong> 964, 993, 996 GT3, 997 Turbo, 944 Turbo</p><p><strong>BMW:</strong> E36 M3, E46 M3, E39 M5, Z3 M Coupe</p><p><strong>Mercedes:</strong> CLK63 Black Series</p><p><strong>Ferrari:</strong> F430</p><p><strong>Aston Martin:</strong> V8 Vantage (manual)</p><p><strong>Acura/Honda/Nissan:</strong> NSX (NA1), S2000, 300ZX Twin Turbo</p>",
      note: "Subject to availability, acquisition timing and member demand."
    },
    membership: {
      title: "Great cars.<br>Easy access.<br><em>Zero friction.</em>",
      lead: "Membership includes an initiation fee and monthly dues. Full details are shared privately with applicants during the review process."
    },
    waitlist: {
      tag: "Founding Member Waitlist",
      title: "Ready to<br><em>join?</em>",
      intro: "We review all submissions. Space is limited.",
      formQuestions: {
        manualQuestion: "Do you drive manual?",
        ownCarQuestion: "Own an enthusiast car?",
        currentCarQuestion: "If yes, what do you own?",
        currentCarPlaceholder: "e.g., 2002 BMW M3",
        interestsQuestion: "What types of cars are you most interested in?",
        whyJoinQuestion: "Why are you interested in joining BVCC?",
        readyQuestion: "Would you be ready to join in early spring if accepted?",
        costQuestion: "Membership will include an initiation fee in the mid–four-figure range and monthly dues. Is this general level of cost within what you'd expect for a drivers' club?",
        costOptions: {
          opt1: "Yes",
          opt2: "I'd need to learn more",
          opt3: "No",
          opt4: "I'd need more detail before deciding"
        },
        usageQuestion: "How often do you expect to use the club?",
        commentsQuestion: "Any other comments on how we could make this your dream garage?"
      }
    }
  };
}
