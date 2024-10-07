import { h } from "nano-jsx";

export const App = () => {
    return (
        <html>
            <head>
                <link href="./style.css" rel="stylesheet" />
            </head>
            <div className="mt-2">
                <header>
                    <nav>
                        <ul>
                            <li>Home</li>
                            <li>About</li>
                            <li>Contact</li>
                        </ul>
                    </nav>
                </header>

                <section>Hello</section>

                <footer>
                    <p>footer</p>
                </footer>
            </div>
        </html>
    );
};
