import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="app-header">
            <nav>
                <Link to="/"><button>Trang chủ</button></Link>
                <Link to="/speaking"><button>Luyện nói</button></Link>
                <Link to="/writing"><button>Luyện viết</button></Link>
            </nav>
        </header>
    );
};

export default Header;