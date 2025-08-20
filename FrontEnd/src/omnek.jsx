import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './homepage'
import LoginPage from './loginpage'
import SignupPage from './signuppage'
import ProfilePage from './profilepage'
import VideoUploadPage from './videouploadpage'
import VideoViewerPage from './videoviewerpage'
import MyVideosPage from './myvideospage';

function Omnek(){
    
    return(
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/u/login" element={<LoginPage/>}/>
                <Route path="/u/signup" element={<SignupPage/>}/>
                <Route path="/u/profile" element={<ProfilePage />}/>
                <Route path="/video/upload" element={<VideoUploadPage />}/>
                <Route path="/video/:id" element={<VideoViewerPage />}/>
                <Route path="/u/videos" element={<MyVideosPage/>}/>
            </Routes>
           
        </Router>
    );

}


export default Omnek;