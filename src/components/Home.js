import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <Header />
            <main className="home-content">
                <div className="page-content-wrapper">
                    <h1>Chào Mừng Đến Với Học Tiếng Anh Vui Vẻ!</h1>
                    <p>Hãy cùng nhau học tiếng Anh qua những trò chơi thú vị và bài học hấp dẫn!</p>
                    <div className="cards-container">
                        <div className="card">
                            <h2>Luyện nói</h2>
                            <p>Cải thiện kỹ năng nói tiếng Anh của bạn!</p>
                            <Link to="/speaking"><button>Bắt Đầu Luyện Nói</button></Link>
                        </div>
                        <div className="card">
                            <h2>Luyện viết</h2>
                            <p>Phát triển kỹ năng viết tiếng Anh của bạn!</p>
                            <Link to="/writing"><button>Bắt Đầu Luyện Viết</button></Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
