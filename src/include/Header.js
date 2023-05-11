const Header = () => {
    return(
        <>
<header className="header cfixed">
    
    <h1 class="logo">
        <a href="#">
            HYI
        </a>
    </h1>

    <nav>
        <ul class="gnb">
            <li>
                <a href="#">
                    HOME
                </a>
            </li>
            <li>
                <a href="#">
                    WE ARE
                </a>
            </li>
            <li>
                <a href="#">
                    WORK
                </a>
            </li>
            <li>
                <a href="#">
                    BLOG
                </a>
            </li>
            <li>
                <a href="#">
                    CONTACT US
                </a>
            </li>
        </ul>
    </nav>
    <span className="menu-toggle-btn">
        <span></span>
        <span></span>
        <span></span>
    </span>
</header>
        </>
    )
}
export default Header;