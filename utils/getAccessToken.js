const axios = require('axios')

exports.getAccessToken = async()=>{
    // const tenantId= '1a138626-759e-4827-97f1-b49b7fd4caef';
    const clientId= process.env.CLIENT_ID
    const clientSecret= process.env.CLIENT_SECRET
    const authority= process.env.AUTHORITY

    try{
        const response = await axios.post(authority, new URLSearchParams({
             grant_type: 'client_credentials',
            client_id:clientId,
            client_secret:clientSecret,
            scope: 'https://api.businesscentral.dynamics.com/.default',
           

        }).toString(), {
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = response.data.access_token
        return accessToken
    } catch(error){
        console.error('Error getting access token', error)
        throw error;
    }
}


