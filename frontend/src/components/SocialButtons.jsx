function SocialButtons() {
  return (
    <div className="social-buttons">
      <button className="google">
        <i className="fa-brands fa-google"></i> <span>Google</span>
      </button>
      <button onClick={()=>{alert("hi")}} className="facebook">
        <i className="fa-brands fa-facebook-f"></i> <span>Facebook</span>
      </button>
    </div>
  );
}
export default SocialButtons;