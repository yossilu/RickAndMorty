import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate('/')
    };

    return (
        <section>
            <h1>Unauthorized!</h1>
            <br />
            <p>You dont have access to this page</p>
            <div className="flexGrow">
                <button onClick={goBack}>Go Back</button>
            </div>
        </section>
    )
}

export default Unauthorized