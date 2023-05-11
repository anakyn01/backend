const Body = () => {
    return(
        <>
<article className="slider">
    <img src="images/p-images/slide01.jpg" alt="slideimage"/>
</article>
<section className="content">
    <section className="display-section">
        <div className="container">
            <h2 className="sec-tit">
            WE ARE
            </h2>
            <p className="desc">
                Sint eu et excepteur aliqua irure laboris aliqua mollit enim dolor duis. Lorem aliquip ad aute fugiat consequat sunt tempor ex non. Elit reprehenderit reprehenderit sint aliqua pariatur Lorem ea. Ad veniam enim non sit. Labore elit laborum in magna reprehenderit occaecat eiusmod enim sit exercitation.
            </p>
        </div>
    </section>

    <section className="promotion-section">
        <div className="container">
            <ul className="promo-list">
                <li>
                    <a href="#">
                        <img src="images/s-images/promo01.png" alt=""/>
                        <h3>HOME</h3>
                        <p>Excepteur aute magna dolore ea ex do.</p>
                    </a>
                </li>

                <li>
                    <a href="#">
                        <img src="images/s-images/promo02.png" alt=""/>
                        <h3>WE ARE</h3>
                        <p>Excepteur aute magna dolore ea ex do.</p>
                    </a>
                </li>

                <li>
                    <a href="#">
                        <img src="images/s-images/promo03.png" alt=""/>
                        <h3>WORK</h3>
                        <p>Excepteur aute magna dolore ea ex do.</p>
                    </a>
                </li>

                <li>
                    <a href="#">
                        <img src="images/s-images/promo04.png" alt=""/>
                        <h3>BLOG</h3>
                        <p>Excepteur aute magna dolore ea ex do.</p>
                    </a>
                </li>
            </ul>
        </div>
    </section>
    <hr class="divider"/>

    <section className="work-section cfixed">
        <h2 className="sec-tit">
            WORK
        </h2>
        <ul className="work-list">
            
            <li>
                <a href="#">
                    <div className="info">
                        <h3>Running</h3>
                        <span>WEB/PRINT</span>
                    </div>
                    <img src="images/p-images/work01.jpg" alt=""/>
                </a>
            </li>

            <li>
                <a href="#">
                    <div className="info">
                        <h3>Rugby</h3>
                        <span>WEB/PRINT</span>
                    </div>
                    <img src="images/p-images/work02.jpg" alt=""/>
                </a>
            </li>

            <li>
                <a href="#">
                    <div className="info">
                        <h3>Weight</h3>
                        <span>WEB/PRINT</span>
                    </div>
                    <img src="images/p-images/work03.jpg" alt=""/>
                </a>
            </li>

            <li>
                <a href="#">
                    <div className="info">
                        <h3>Marathon</h3>
                        <span>WEB/PRINT</span>
                    </div>
                    <img src="images/p-images/work04.jpg" alt=""/>
                </a>
            </li>

            <li>
                <a href="#">
                    <div className="info">
                        <h3>Boxing</h3>
                        <span>WEB/PRINT</span>
                    </div>
                    <img src="images/p-images/work05.jpg" alt=""/>
                </a>
            </li>

            <li>
                <a href="#">
                    <div className="info">
                        <h3>Ice Hockey</h3>
                        <span>WEB/PRINT</span>
                    </div>
                    <img src="images/p-images/work06.jpg" alt=""/>
                </a>
            </li>

            <li>
                <a href="#">
                    <div className="info">
                        <h3>Skate Board</h3>
                        <span>WEB/PRINT</span>
                    </div>
                    <img src="images/p-images/work07.jpg" alt=""/>
                </a>
            </li>

            <li>
                <a href="#">
                    <div className="info">
                        <h3>Basketball</h3>
                        <span>WEB/PRINT</span>
                    </div>
                    <img src="images/p-images/work08.jpg" alt=""/>
                </a>
            </li>


        </ul>
    </section>

    <hr className="m-divider"/>

    <section className="blog-section">
        <div className="container">
            <h2 className="sec-tit">BLOG</h2>
            <ul className="blog-list">
                
                <li>
                    <a href="#">
                        <img src="images/p-images/blog01.jpg" alt=""/>
                    </a>
                    <time datetime="2023-05-10">
                    May 10, 2023
                    </time>
                    <a href="#">
                        <h3>
                        Pariatur aute minim id cupidatat pariatur.
                        </h3> 
                    </a>
                </li>

                <li>
                    <a href="#">
                        <img src="images/p-images/blog02.jpg" alt=""/>
                    </a>
                    <time datetime="2023-05-10">
                    May 10, 2023
                    </time>
                    <a href="#">
                        <h3>
                        Pariatur aute minim id cupidatat pariatur.
                        </h3> 
                    </a>
                </li>

                <li>
                    <a href="#">
                        <img src="images/p-images/blog03.jpg" alt=""/>
                    </a>
                    <time datetime="2023-05-10">
                    May 10, 2023
                    </time>
                    <a href="#">
                        <h3>
                        Pariatur aute minim id cupidatat pariatur.
                        </h3> 
                    </a>
                </li>
            </ul>
        </div>
    </section>

<section className="contact-section">
    <div className="container">
        <h2 class="sec-tit">
            CONTACT
        </h2>

        <div className="form-box">
            <form action="ex.js" method="post">


            </form>
        </div>
    </div>
</section>



</section>
        </>
    )
}
export default Body;