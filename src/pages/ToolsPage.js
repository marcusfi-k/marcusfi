// src/pages/ToolsPage.js

const { useState } = React;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { createStore, combineReducers } = Redux;
const { PieChart, Pie, Tooltip, Cell } = Recharts;

// Reducer cho financial freedom
const initialFinancialFreedomState = {
  monthlyCost: 0,
  emergencyFund: 0,
  financialFreedomAmount: 0,
};

const financialFreedomReducer = (state = initialFinancialFreedomState, action) => {
  switch (action.type) {
    case 'CALCULATE_FINANCIAL_FREEDOM':
      const { monthlyCost, emergencyFund } = action.payload;
      const necessaryFunds = (monthlyCost * 12) / 0.04;
      return {
        ...state,
        monthlyCost,
        emergencyFund,
        financialFreedomAmount: necessaryFunds,
      };
    default:
      return state;
  }
};

// Action creator
const calculateFinancialFreedom = (payload) => ({
  type: 'CALCULATE_FINANCIAL_FREEDOM',
  payload,
});

// Tạo store với reducer
const rootReducer = combineReducers({
  financialFreedom: financialFreedomReducer,
});
const store = createStore(rootReducer);

function ToolsPage() {
  const [monthlyCost, setMonthlyCost] = useState('');
  const [emergencyFund, setEmergencyFund] = useState('');
  const [investments, setInvestments] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const financialFreedomAmount = useSelector(
    (state) => state.financialFreedom.financialFreedomAmount
  );

  // Màu sắc cho các phần của biểu đồ
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Xử lý submit form tính toán tự do tài chính
  const handleFinancialFreedomSubmit = (event) => {
    event.preventDefault();
    dispatch(
      calculateFinancialFreedom({
        monthlyCost: parseFloat(monthlyCost),
        emergencyFund: parseFloat(emergencyFund) || 0,
      })
    );
  };

  // Xử lý thêm khoản đầu tư mới
  const addInvestment = (investment) => {
    setInvestments([...investments, investment]);
  };

  // Xử lý thêm dữ liệu chi tiêu
  const handleAddExpense = (expense) => {
    setExpenseData([...expenseData, expense]);
  };

  return (
    <div className="tools-page">
      {/* Công cụ tính số tiền tự do tài chính */}
      <section className="tool-section">
        <h2>Công cụ tính số tiền tự do tài chính</h2>
        <form onSubmit={handleFinancialFreedomSubmit}>
          <label>
            Chi phí trung bình hàng tháng:
            <input
              type="number"
              value={monthlyCost}
              onChange={(e) => setMonthlyCost(e.target.value)}
            />
          </label>
          <label>
            Quỹ dự phòng:
            <input
              type="number"
              value={emergencyFund}
              onChange={(e) => setEmergencyFund(e.target.value)}
            />
          </label>
          <button type="submit">Tính toán</button>
        </form>
        <div>
          <p>Số tiền cần để đạt tự do tài chính: {financialFreedomAmount.toFixed(2)} VND</p>
        </div>
      </section>

      {/* Công cụ quản lý thu chi */}
      <section className="tool-section">
        <h2>Công cụ quản lý thu chi</h2>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={expenseData}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {expenseData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <form onSubmit={(e) => {
          e.preventDefault();
          const expense = { value: 1000, name: 'Example Expense' }; // Thêm logic thêm chi tiêu vào đây
          handleAddExpense(expense);
        }}>
          {/* Form nhập thu chi */}
        </form>
      </section>

      {/* Công cụ quản lý danh mục đầu tư */}
      <section className="tool-section">
        <h2>Công cụ quản lý danh mục đầu tư</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const investment = { /* dữ liệu đầu tư */ }; // Thêm logic thêm đầu tư vào đây
          addInvestment(investment);
        }}>
          {/* Form thêm đầu tư */}
        </form>
        {/* Hiển thị danh sách các đầu tư */}
      </section>
    </div>
  );
}

// Render component vào DOM với Redux Provider
ReactDOM.render(
  <Provider store={store}>
    <ToolsPage />
  </Provider>,
  document.getElementById('root')
);
