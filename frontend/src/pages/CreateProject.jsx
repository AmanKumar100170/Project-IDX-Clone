import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../hooks/apis/mutations/useCreateProject';
import { Button, Row, Col, Flex } from 'antd';

export const CreateProject = () => {

    const { createProjectMutation } = useCreateProject();

    const navigate = useNavigate();

    async function handleCreateProject() {
        console.log("Triggering the API");
        try {
            const response = await createProjectMutation();
            console.log('Now we need to redirect the user to the editor');
            navigate(`/project/${response.data}`);
        } catch (error) {
            console.log('Error Creating Project', error);
        }   
    }

    return (
        <Row>
            <Col span={24}>
                <Flex justify='center' align='center'>
                    <Button
                        type='primary'
                        onClick={handleCreateProject}
                    >
                        Create Playground
                    </Button>
                </Flex>
            </Col>
        </Row>
    )
}