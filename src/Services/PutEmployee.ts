import {Employee} from "../Utility/GlobalTypes";

const PutEmployee = async (adminId: string, employee: Employee, type: string, employeeId: string | null): Promise<string | null> => {
  try {

    const response = await fetch(`${process.env.REACT_APP_BE_URL}/Client/updateEmployees/${adminId}?type=${type}`, {
      method: 'PUT', // Change method to PUT
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee)
    });

    if (!response.ok) {
      throw { status: response.status, message: `HTTP error! Status: ${response.status}` };
    }

    const data = await response.json();
    // use FE Logger when set up ('Profile Posted Successfully')
    return data.id;
  } catch (error: any) {
    // use FE Logger when set up ('Error posting profile data')
    return null;
  }
};

export default PutEmployee;