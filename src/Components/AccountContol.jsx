import { Box, Typography, Button, Card, CardContent, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AccountControl() {
    const navigate = useNavigate();

    function handleCreateAccount() {
        navigate('/account-category');
    }

    function handleCreateCategory() {
        navigate('/accounts');
    }

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: '50px', px: 2 }}>
            <Typography variant="h4" gutterBottom>
                Accounts Information
            </Typography>
            
            <Box mb={4}>
                <Typography variant="h6" color="textPrimary">
                    <strong>Types of Accounts:</strong>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Our account structure is organized into three main levels:
                    <ul>
                        <li><strong>1. Account Types:</strong> The top-level categories, such as Purchase Accounts and Sales Accounts.</li>
                        <li><strong>2. Account Categories:</strong> Subcategories within each Account Type. For example, Operating Expenses falls under a Purchase Account type.</li>
                        <li><strong>3. Account Subcategories:</strong> More specific divisions within an Account Category. For example, Spares can be a subcategory under Operating Expenses.</li>
                    </ul>
                </Typography>
            </Box>

            <Typography fontSize='17px' color="textSecondary" paragraph>
                Above is a demonstration of how accounts are structured. You can start with either Purchase or Sales at the top level. Below that, you will find categories and subcategories that help in organizing and managing account details.
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            1. Create Account Category
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            To create a new account category, click the button below. This allows you to add a broad classification under which you can organize your accounts.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateAccount}
                        >
                            Create Account Category
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h5">
                            2. Create Sub Category
                        </Typography>
                        <Typography fontSize='17px' color="textSecondary" paragraph>
                            Use the button below to create an account subcategory. Subcategories allow for more detailed organization within an account category.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateCategory}
                        >
                            Create Sub Category
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default AccountControl;
