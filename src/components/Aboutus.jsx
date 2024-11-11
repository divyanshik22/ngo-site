import "./Aboutus.css";
const Aboutus = () => {
  return (
    <div
      class="container-fluid"
      style={{
        backgroundColor: "#0F6465",
        color: "white",
        marginBottom: "0",
        paddingBottom: "0",
      }}
    >
      <footer class="py-5">
        <div>About Us</div>
        <div class="row">
          <div class="col-6 col-md-2 mb-3">
            <h5>Section</h5>
            <ul class="nav flex-column">
              <li class="nav-item mb-2">
                <a
                  class="nav-link p-0 text-body-secondary"
                  style={{
                    color: "white",
                  }}
                >
                  Home
                </a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">Features</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">Pricing</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">FAQs</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">About</a>
              </li>
            </ul>
          </div>

          <div class="col-6 col-md-2 mb-3">
            <h5>Section</h5>
            <ul class="nav flex-column">
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">Home</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">Features</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">Pricing</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">FAQs</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">About</a>
              </li>
            </ul>
          </div>

          <div class="col-6 col-md-2 mb-3">
            <h5>Section</h5>
            <ul class="nav flex-column">
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">Home</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">Features</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">Pricing</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">FAQs</a>
              </li>
              <li class="nav-item mb-2">
                <a class="nav-link p-0 text-body-secondary">About</a>
              </li>
            </ul>
          </div>

          <div class="col-md-5 offset-md-1 mb-3">
            <form>
              <h5>Subscribe to our newsletter</h5>
              <p>Monthly digest of what's new and exciting from us.</p>
              <div class="d-flex flex-column flex-sm-row w-100 gap-2">
                <label for="newsletter1" class="visually-hidden">
                  Email address
                </label>
                <input
                  id="newsletter1"
                  type="text"
                  class="form-control"
                  placeholder="Email address"
                />
                <button class="btn btn-primary" type="button">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Aboutus;
