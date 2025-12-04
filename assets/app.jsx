const { useEffect, useState } = React;

// Адрес
const API_URL = "http://localhost:3001";

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [selectedUser, setSelectedUser] = useState(null);

  const debouncedSearch = useDebouncedValue(search, 350);

  const fetchUsers = (term) => {
    setLoading(true);
    setError("");

    const url =
      term && term.trim().length > 0
        ? API_URL + "?term=" + encodeURIComponent(term.trim())
        : API_URL;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка сети: " + res.statusText);
        }
        return res.json();
      })
      .then((json) => {
        if (!json.success) {
          throw new Error(json?.error?.message || "Ошибка сервера");
        }
        const data = json.data || [];
        const sorted = [...data].sort((a, b) => {
          const an = a.name.toLowerCase();
          const bn = b.name.toLowerCase();
          if (an < bn) return sort === "asc" ? -1 : 1;
          if (an > bn) return sort === "asc" ? 1 : -1;
          return 0;
        });
        setUsers(sorted);
      })
      .catch((e) => {
        console.error(e);
        setError(e.message || "Не удалось загрузить пользователей");
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers("");
  }, []);

  useEffect(() => {
    fetchUsers(debouncedSearch);
  }, [debouncedSearch, sort]);

  const handleCardClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  // Страничка
  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="search-row">
            <div className="search-input-wrapper">
              <span className="search-icon">
                <i className="fa fa-address-book" aria-hidden="true"></i>
              </span>
              <input
                className="search-input"
                type="text"
                placeholder="Поиск по имени пользователя..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="asc">Сортировать: A → *</option>
              <option value="desc">Сортировать: * → A</option>
            </select>
          </div>
        </header>

        {loading && (
          <div className="loader">Загружаем список пользователей…</div>
        )}

        {error && !loading && <div className="error-state">{error}</div>}

        {!loading && !error && users.length === 0 && (
          <div className="empty-state">
            Пользователи не найдены. Попробуйте изменить строку поиска.
          </div>
        )}

        {/* Карточка пользака */}
        {!error && users.length > 0 && (
          <div className="users-grid">
            {users.map((user) => (
              <article
                key={user.id}
                className="user-card"
                onClick={() => handleCardClick(user)}
              >
                <h2 className="user-name">{user.name}</h2>
                <div className="user-line">
                   <span className="phone-icon">
                <i className="fa fa-phone" aria-hidden="true"></i>
              </span>
              
                  <span>{ user.phone}</span>
                </div>
                <div className="user-line">
                   <span className="inbox-icon">
                    <i className="fa fa-inbox" aria-hidden="true"></i>
                  </span>
              
                  <span> { user.email}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedUser && <Modal user={selectedUser} onClose={closeModal} />}
    </div>
  );
}

// Модалка
function Modal({ user, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target.dataset.backdrop === "true") {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      data-backdrop="true"
      onClick={handleBackdropClick}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{user.name}</div>
          <button
            type="button"
            className="modal-close"
            aria-label="Закрыть"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="info-grid">
            <div className="info-label">Телефон:</div>
            <div className="info-value">{user.phone}</div>

            <div className="info-label">Почта:</div>
            <div className="info-value">{user.email}</div>

            <div className="info-label">Дата приёма:</div>
            <div className="info-value">{user.hire_date}</div>

            <div className="info-label">Должность:</div>
            <div className="info-value">{user.position_name}</div>

            <div className="info-label">Подразделение:</div>
            <div className="info-value">{user.department}</div>
          </div>

          <div className="section-title">Дополнительная информация:</div>
          <div className="extra-text">
            {user.address || "Дополнительная информация отсутствует"}
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);


