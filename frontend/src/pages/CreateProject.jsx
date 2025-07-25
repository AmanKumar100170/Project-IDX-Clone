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
        <Row
            justify="center"
            align="middle"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #18181b 0%, #1e293b 100%)',
            }}
        >
            <Col xs={22} sm={16} md={12} lg={8}>
                <Flex
                    vertical
                    align="center"
                    justify="center"
                    style={{
                        background: 'rgba(30, 41, 59, 0.95)',
                        borderRadius: 20,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
                        padding: '56px 36px',
                        gap: 28,
                        border: '1px solid #334155',
                    }}
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png"
                        alt="Create Project"
                        style={{
                            width: 72,
                            marginBottom: 18,
                            filter: 'drop-shadow(0 2px 8px #6366f1)',
                        }}
                    />
                    <h2
                        style={{
                            margin: 0,
                            fontWeight: 800,
                            fontSize: 32,
                            color: '#f1f5f9',
                            letterSpacing: 1,
                        }}
                    >
                        Create a New Playground
                    </h2>
                    <p
                        style={{
                            color: '#94a3b8',
                            fontSize: 17,
                            textAlign: 'center',
                            marginBottom: 18,
                            lineHeight: 1.6,
                        }}
                    >
                        Start a new coding project instantly.<br />
                        Choose your stack, collaborate, and unleash your creativity!
                    </p>
                    <Flex gap={16} vertical>
                        <Button
                            type="primary"
                            size="large"
                            shape="round"
                            onClick={handleCreateProject}
                            style={{
                                background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: 19,
                                boxShadow: '0 2px 12px rgba(99,102,241,0.25)',
                                color: '#fff',
                                padding: '0 32px',
                            }}
                        >
                            Create Playground
                        </Button>
                    </Flex>
                    <div
                        style={{
                            marginTop: 24,
                            color: '#64748b',
                            fontSize: 15,
                            textAlign: 'center',
                        }}
                    >
                        <span role="img" aria-label="sparkles">✨</span> Fast, collaborative, and fun coding experience.
                    </div>
                </Flex>
            </Col>
        </Row>
    )
}