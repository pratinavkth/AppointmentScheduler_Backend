require('dotenv').config();
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Simple token storage (replace with your database)
const userTokens = new Map();

// Save tokens function - implement your database logic here
async function saveUsersToken(userId, tokens) {
    try {
        // For now, using in-memory storage
        userTokens.set(userId, {
            ...tokens,
            createdAt: new Date()
        });
        
        console.log(`Tokens saved for user ${userId}`);
        
        
        return true;
    } catch (error) {
        console.error(' Error saving tokens:', error);
        throw error;
    }
}

// Get tokens function - implement your database logic here
async function getUserTokens(userId) {
    try {
        // For now, using in-memory storage
        const tokens = userTokens.get(userId);
        
        if (!tokens) {
            console.log(` No tokens found for user ${userId}`);
            return null;
        }
        
        console.log(` Tokens retrieved for user ${userId}`);
        return tokens;  
    } catch (error) {
        console.error(' Error retrieving tokens:', error);
        throw error;
    }
}

// Create OAuth client helper function
function createOAuthClient() {
    return new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.SECRET_ID,
        process.env.REDIRECT
    );
}

// Debug route to check OAuth setup
exports.debugOAuth = (req, res) => {
    console.log('=== DEBUG OAUTH SETUP ===');
    console.log('CLIENT_ID:', process.env.CLIENT_ID);
    console.log('SECRET_ID:', process.env.SECRET_ID ? 'Present' : 'Missing');
    console.log('REDIRECT:', process.env.REDIRECT);
    
    try {
        const oauth2Client = createOAuthClient();
        
        const testUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            state: 'test-user',
            prompt: 'consent'
        });
        
        res.json({
            status: 'OAuth setup check',
            environment: {
                CLIENT_ID: process.env.CLIENT_ID || 'Missing',
                SECRET_ID: process.env.SECRET_ID ? 'Present' : 'Missing',
                REDIRECT: process.env.REDIRECT || 'Missing'
            },
            generatedUrl: testUrl,
            urlAnalysis: {
                hasClientId: testUrl.includes(process.env.CLIENT_ID),
                hasRedirectUri: testUrl.includes(encodeURIComponent(process.env.REDIRECT)),
                hasScope: testUrl.includes('calendar')
            }
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'OAuth setup failed',
            details: error.message,
            stack: error.stack
        });
    }
};

// Initiate Google OAuth
exports.googleAuth = async (req, res) => {
    try {
        // Validate required environment variables
        if (!process.env.CLIENT_ID || !process.env.SECRET_ID || !process.env.REDIRECT) {
            console.error('Missing required environment variables');
            return res.status(500).json({
                error: 'Server configuration error',
                message: 'Missing required OAuth credentials'
            });
        }

        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            console.error('User not authenticated');
            return res.status(401).json({
                error: 'Authentication required',
                message: 'User must be logged in to connect calendar'
            });
        }

        const oauth2Client = createOAuthClient();
        
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            state: req.user.id,
            prompt: 'consent',
            include_granted_scopes: true
        });
        
        console.log(' Generated auth URL, redirecting user...',authUrl);
        console.log('User ID:', req.user.id);
        
        res.redirect(authUrl);
        
    } catch (error) {
        console.error(' Auth error:', error);
        res.status(500).json({
            error: 'Failed to initiate OAuth',
            message: error.message
        });
    }
};

// Handle Google OAuth callback
exports.googleCallback = async (req, res) => {
    const code = req.query.code;
    const userId = req.query.state;
    const error = req.query.error;
    
    console.log(' OAuth callback received');
    console.log('Code present:', !!code);
    console.log('User ID:', userId);
    console.log('Error:', error);
    
    // Handle OAuth errors
    if (error) {
        console.error('OAuth error from Google:', error);
        return res.status(400).send(`
            <html>
                <head><title>Authorization Failed</title></head>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #dc3545;"> Authorization Failed</h1>
                    <p>Error: ${error}</p>
                    <p><a href="/auth/google" style="color: #007bff;">Try Again</a></p>
                </body>
            </html>
        `);
    }
    
    if (!code) {
        console.error('No authorization code received');
        return res.status(400).send(`
            <html>
                <head><title>Authorization Failed</title></head>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #dc3545;"> Authorization Failed</h1>
                    <p>No authorization code received</p>
                    <p><a href="/auth/google" style="color: #007bff;"> Try Again</a></p>
                </body>
            </html>
        `);
    }

    if (!userId) {
        console.error(' No user ID received');
        return res.status(400).send(`
            <html>
                <head><title>Authorization Failed</title></head>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #dc3545;"> Authorization Failed</h1>
                    <p>Invalid user session</p>
                    <p><a href="/auth/google" style="color: #007bff;">🔄 Try Again</a></p>
                </body>
            </html>
        `);
    }
    
    try {
        const oauth2Client = createOAuthClient();
        
        console.log('Exchanging code for tokens...');
        const { tokens } = await oauth2Client.getToken(code);
        
        console.log('Tokens received successfully');
        console.log(' Token details:', {
            access_token: tokens.access_token ? 'Present' : 'Missing',
            refresh_token: tokens.refresh_token ? 'Present' : 'Missing',
            scope: tokens.scope,
            expires_in: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'Unknown'
        });
        
        // Save tokens
        await saveUsersToken(userId, tokens);
        
        res.send(`
            <html>
                <head>
                    <title>Calendar Connected</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            margin-top: 50px; 
                            background: #f5f5f5;
                        }
                        .container { 
                            max-width: 500px; 
                            margin: 0 auto; 
                            background: white; 
                            padding: 40px; 
                            border-radius: 10px; 
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        .success { color: #28a745; }
                        .btn { 
                            background: #007bff; 
                            color: white; 
                            padding: 10px 20px; 
                            border: none; 
                            border-radius: 5px; 
                            cursor: pointer; 
                            margin-top: 20px;
                        }
                        .btn:hover { background: #0056b3; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="success"> Calendar Connected Successfully!</h1>
                        <p>Your Google Calendar has been connected to your account.</p>
                        <p>You can now close this window and return to the application.</p>
                        <button class="btn" onclick="window.close()">Close Window</button>
                    </div>
                    <script>
                        // Auto-close after 5 seconds
                        setTimeout(() => {
                            window.close();
                        }, 5000);
                    </script>
                </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Token exchange failed:', error);
        
        if (error.code === 400 && error.message.includes('invalid_grant')) {
            return res.status(400).send(`
                <html>
                    <head><title>Authorization Failed</title></head>
                    <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                        <h1 style="color: #dc3545;"> Authorization Failed</h1>
                        <p>The authorization code has expired or been used already.</p>
                        <p><strong>Please try the authorization process again.</strong></p>
                        <a href="/auth/google" style="color: #007bff; text-decoration: none;">🔄 Try Again</a>
                    </body>
                </html>
            `);
        }
        
        res.status(500).send(`
            <html>
                <head><title>Authorization Failed</title></head>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #dc3545;"> Authorization Failed</h1>
                    <p>Error: ${error.message}</p>
                    <p><a href="/auth/google" style="color: #007bff;">🔄 Try Again</a></p>
                </body>
            </html>
        `);
    }
};

// Export helper functions
module.exports = {
    ...module.exports,
    saveUsersToken,
    getUserTokens,
    createOAuthClient
};