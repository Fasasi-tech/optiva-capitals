const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { getAccessToken } = require("../utils/getAccessToken");
const axios= require('axios')


exports.bcMiddleware = async(req, res, next) =>{
    try{
        const accessToken = await getAccessToken()
    const tenantId= '1a138626-759e-4827-97f1-b49b7fd4caef';
    const environment='OPTIVA_API';
    const companyId='My Company'

    req.bcConfig = {
        accessToken,
        tenantId,
        environment,
        companyId
    }
    next()
} catch(error){
    console.error('Error in Business Central middleware:', error);
    res.status(500).send('Failed to configure Business Central API access');
}
}

// app.use('/bc/*', exports.bcMiddleware);

exports.employeeList = async(req, res) =>{
    const { accessToken, tenantId, environment, companyId } = req.bcConfig;
    const url = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/company('${companyId}')/HREmployeeList`;
    try{
        
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // console.log(response)
        // console.log('access', accessToken)
        // console.log(response, "response")
        res.status(200).json(response.data); 

    }catch (error) {
        console.error('Error fetching employee:', error.response ? error.response.data : error.message);
        
        // Sending back the error message and status code to the frontend
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.response.data || 'Failed to generate leave types' });
        } else {
            res.status(500).json({ error: 'Failed to fetch employee' });
        }
    }
};

exports.employeePaySlip = async(req, res) =>{
    const { accessToken, tenantId, environment, companyId } = req.bcConfig;
    const url = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/paySlipInteg_GetPaySlip?Company=9981f8b7-081c-ec11-bb75-000d3a2200ea`;

    const employeePaySlip={
        employeeNo:req.body.employeeNo,
        periodDate: req.body.periodDate,

    }
    try{
        
        const response = await axios.post(url, employeePaySlip, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        // console.log(response)
        // console.log('Employee created successfully:', response.data);
        res.status(201).json(response.data); 
    }catch (error) {
        console.error('Error generating payslip:', error.response ? error.response.data : error.message);
        
        // Sending back the error message and status code to the frontend
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.response.data || 'Failed to generate leave types' });
        } else {
            res.status(500).json({ error: 'Failed to generate payslip' });
        }
    }
};

exports.leavePeriod = async(req, res) =>{
    const { accessToken, tenantId, environment, companyId } = req.bcConfig;
    const url = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/company('${companyId}')/HRLeavePeriodList`;

    try{
        
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        // console.log(response)
        // console.log('Employee created successfully:', response.data);
        res.status(200).json(response.data); 
    }catch (error) {
        console.error('Error fetching leave period:', error.response ? error.response.data : error.message);
        
        // Sending back the error message and status code to the frontend
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.response.data || 'Failed to generate leave period' });
        } else {
            res.status(500).json({ error: 'Failed to fetch leave period' });
        }
    }
};

exports.leaveTypes = async(req, res) =>{
    const { accessToken, tenantId, environment, companyId } = req.bcConfig;
    const url = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/company('${companyId}')/HRLeaveTypes`;

    try{
        
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        // console.log(response)
        // console.log('Employee created successfully:', response.data);
        res.status(200).json(response.data); 
    }catch (error) {
        console.error('Error generating leave types:', error.response ? error.response.data : error.message);
        // Sending back the error message and status code to the frontend
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.response.data || 'Failed to generate leave types' });
        } else {
            res.status(500).json({ error: 'Failed to generate leave types' });
        }
    }
};

exports.postLeave = async(req, res) =>{
    const {accessToken, tenantId, environment, companyId} = req.bcConfig;
    const url= `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/company('${companyId}')/HRLeaveApplicationCard`;
    // const {  Company_Email, Leave_Period, Leave_Type, Days_Applied, Cell_Phone_Number, Employee_Reliver, Start_Date}= req.body;

    const data={
    Company_Email: req.body.Company_Email, // Default if not provided
    Leave_Period: req.body.Leave_Period,
    Leave_Type: req.body.Leave_Type,
    Days_Applied: req.body.Days_Applied,
    Cell_Phone_Number: req.body.Cell_Phone_Number,
    Employee_Reliver: req.body.Employee_Reliver,
    Start_Date: req.body.Start_Date

    }

    try{
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
    
           
        });

        // console.log('Employee created successfully:', response.data);
        res.status(201).json(response.data); 

    }catch(error){
        if (error.response && error.response.data && error.response.data.error) {
            const errorMessage = error.response.data.error.message;
            console.error('Error from Business Central:', errorMessage);
            res.status(400).json({ error: errorMessage });
        } else {
            console.error('Error creating leave application:', error.message);
            res.status(500).send('Failed to create leave application');
        }

    } 
}

exports.complaintForm = async(req, res) =>{
    const {accessToken, tenantId, environment, companyId} = req.bcConfig;
    const url= `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/company('${companyId}')/complaintFormCard`;
    // const {  Company_Email, Leave_Period, Leave_Type, Days_Applied, Cell_Phone_Number, Employee_Reliver, Start_Date}= req.body;

    const data={
    Employee_No: req.body.Employee_No, // Default if not provided
    Nature_of_Complaint: req.body.Nature_of_Complaint,
    Date_of_incident: req.body.Date_of_incident,
    Details_of_Incident: req.body.Details_of_Incident,
    }

    try{
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
    
           
        });

        // console.log('Employee created successfully:', response.data);
        res.status(201).json(response.data); 

    }catch(error){
        if (error.response && error.response.data && error.response.data.error) {
            const errorMessage = error.response.data.error.message;
            console.error('Error from Business Central:', errorMessage);
            res.status(400).json({ error: errorMessage });
        } else {
            console.error('Error creating complaint application:', error.message);
            res.status(500).send('Failed to create complaint form application');
        }

    } 
}
exports.employeecard = async(req, res) =>{
    const { accessToken, tenantId, environment, companyId } = req.bcConfig;
    const { employeeId } = req.params;
    const url = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/company('${companyId}')/HRCardPageApi('${employeeId}')`;

    try{
        
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        // console.log(response)
        // console.log('Employee card retrieved successfully:', response.data);
        res.status(200).json(response.data); 
    }catch (error) {
        console.error('Error generating employee card:', error.response ? error.response.data : error.message);
        
        // Sending back the error message and status code to the frontend
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.response.data || 'Failed to generate employee card' });
        } else {
            res.status(500).json({ error: 'Failed to generate employee card' });
        }
    }
};

exports.payslipcard = async(req, res) =>{
    const { accessToken, tenantId, environment, companyId } = req.bcConfig;
    const { employeeId } = req.params;
    const url = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/Company('${companyId}')/prHeaderSalaryCardAdmin('${employeeId}')`;

    try{
        
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        // console.log(response)
        // console.log('payslip card retrieved successfully:', response.data);
        res.status(200).json(response.data); 
    }catch (error) {
        console.error('Error generating payslip card:', error.response ? error.response.data : error.message);
        
        // Sending back the error message and status code to the frontend
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.response.data || 'Failed to generate payslip' });
        } else {
            res.status(500).json({ error: 'Failed to generate payslip card' });
        }
    }
};

exports.leavehistory = async(req, res) =>{
    const { accessToken, tenantId, environment, companyId } = req.bcConfig;
    const url = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/company('${companyId}')/HRLeaveApplicationsList`;

    try{
        
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        // console.log(response)
        // console.log('Employee leave history retrieved successfully:', response.data);
        res.status(200).json(response.data); 
    }catch (error) {
        console.error('Error generating leave history:', error.response ? error.response.data : error.message);
        
        // Sending back the error message and status code to the frontend
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.response.data || 'Failed to generate leave history' });
        } else {
            res.status(500).json({ error: 'Failed to generate leave history' });
        }
    }
};

exports.payroll = async(req, res) =>{
    const { accessToken, tenantId, environment, companyId } = req.bcConfig;
    const url = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/company('${companyId}')/PAYROLLLINE`;

    try{
        
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        // console.log(response)
        // console.log('Employee leave history retrieved successfully:', response.data);
        res.status(200).json(response.data); 
    }catch (error) {
        console.error('Error generating payroll card:', error.response ? error.response.data : error.message);
        
        // Sending back the error message and status code to the frontend
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.response.data || 'Failed to generate payroll card' });
        } else {
            res.status(500).json({ error: 'Failed to generate payroll card' });
        }
    }
};


exports.payrollDate = async(req, res) =>{
    const { accessToken, tenantId, environment, companyId } = req.bcConfig;
    const url = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/company('${companyId}')/prPayrollPeriods`;

    try{
        
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        // console.log(response)
        // console.log('Employee leave history retrieved successfully:', response.data);
        res.status(200).json(response.data); 
    }catch(error){
        console.error('Error getting payroll date:', error.response ? error.response.data : error.message);
        res.status(500).send('Failed to generate payroll date');
    }
}

exports.complainthistory = async(req, res) =>{
    const { accessToken, tenantId, environment, companyId } = req.bcConfig;
    const url = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${environment}/ODataV4/company('${companyId}')/ComplaintFormListPage`;

    try{
        
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
        // console.log(response)
        // console.log('Employee complaint history retrieved successfully:', response.data);
        res.status(200).json(response.data); 
    }catch (error) {
        console.error('Error generating payroll date:', error.response ? error.response.data : error.message);
        
        // Sending back the error message and status code to the frontend
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.response.data || 'Failed to generate payroll date' });
        } else {
            res.status(500).json({ error: 'Failed to generate payroll date' });
        }
    }
};





