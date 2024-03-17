import { Account } from "../Utility/GlobalTypes";

const postAccount = async (apiData: Account): Promise<string | null> => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BE_URL}/Client`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData)
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

export default postAccount;