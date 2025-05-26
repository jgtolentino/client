# Quick Deploy Instructions

You're one step away from deployment! Surge is asking for credentials.

## In your terminal, type:

1. **Email**: `demo@tbwa.com` (or any email)
2. **Password**: `demo123` (or any password)
3. Press Enter

## Your site will be live at:

🌐 **https://tbwa-client-dashboard.surge.sh**

## Alternative - Use Python HTTP Server:

If you want to test locally first:
```bash
cd /Users/tbwa/Documents/GitHub/client/dist/public
python3 -m http.server 8080
```
Then open: http://localhost:8080

## Future Deployments:

Once you create the Surge account, future deployments are one command:
```bash
cd dist/public && surge
```