# Inngest Setup Instructions

To fix the "Inngest API Error: 404 Event key not found" error, you need to set up an Inngest API key.

## Steps to Set Up Inngest

1. **Sign up for Inngest**:
   - Go to [Inngest](https://www.inngest.com/) and create an account if you don't have one.

2. **Create a New Project**:
   - After signing in, create a new project for your application.

3. **Get Your API Key**:
   - In your project dashboard, go to the "API Keys" section.
   - Create a new API key or copy an existing one.

4. **Add the API Key to Your Environment**:
   - Create a `.env.local` file in your project root (if it doesn't exist already).
   - Add the following line to the file:
     ```
     INNGEST_API_KEY=your_api_key_here
     ```
   - Replace `your_api_key_here` with the actual API key you copied from Inngest.

5. **Set the App URL**:
   - Also add the following line to your `.env.local` file:
     ```
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```
   - For production, change this to your actual domain.

6. **Restart Your Development Server**:
   - After adding these environment variables, restart your Next.js development server.

## Troubleshooting

If you still encounter issues after setting up the API key:

1. Check the console logs for any specific error messages.
2. Verify that the API key is correctly set in your environment.
3. Make sure your Inngest functions are properly registered in the Inngest dashboard.
4. Check that the event name "notes.generate" matches exactly in both your code and Inngest dashboard.

For more information, refer to the [Inngest documentation](https://www.inngest.com/docs). 