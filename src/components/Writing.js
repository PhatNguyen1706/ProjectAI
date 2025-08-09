import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Writing = () => {
    return (
        <div className="home-container">
            <Header />
            <main className="writing home-content">
                <div className="page-content-wrapper">
                    <h1>Luyện Viết Tiếng Anh</h1>
                    <p>Hãy viết lại các câu sau:</p>
                    <div className="writing-area-container card"> {/* Re-using card for styling */}
                        <textarea rows="4" cols="50" placeholder="Viết câu của bạn ở đây..."></textarea>
                        <button onClick={() => alert('Tuyệt vời! Hãy tiếp tục luyện tập!')}>Gửi</button>
                    </div>
                    <Link to="/">
                        <button>Quay Lại Trang Chủ</button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Writing;
