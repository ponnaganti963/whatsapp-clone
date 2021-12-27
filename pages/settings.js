import styled from 'styled-components';
import Head from 'next/head';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useRouter} from "next/router";

function settings() {

    const router = useRouter();

    return (

        <div>
            <Head>
                <title>Settings</title>
                <meta name="description" content="Created with love❤️" />
            </Head>
            <Container>
                <ArrowIcon onClick={ () => router.push('/')}></ArrowIcon>

            </Container>
        </div>
        
    )
}

export default settings;


const Container = styled.div``;

const ArrowIcon = styled(ArrowBackIcon)`
    margin:20px;
`;
