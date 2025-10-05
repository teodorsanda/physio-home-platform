import { render, screen } from "@testing-library/react";
import MarketingPage from "@/app/(marketing)/page";
import PatientPage from "@/app/(patient)/patient/page";

vi.mock("next/link", () => ({
  default: ({ children }: any) => <a>{children}</a>
}));

vi.mock("@/components/marketing/chatbot-widget", () => ({
  ChatbotWidget: () => <div data-testid="chatbot">Chatbot</div>
}));

vi.mock("@/components/patient/dashboard", () => ({
  PatientDashboard: () => <div data-testid="dashboard">Dashboard</div>
}));

describe("UI smoke", () => {
  it("renders marketing hero", () => {
    render(<MarketingPage />);
    expect(screen.getByText(/Physiotherapy that comes to your home/i)).toBeInTheDocument();
  });

  it("renders patient portal", () => {
    render(<PatientPage />);
    expect(screen.getByText(/Patient portal/i)).toBeInTheDocument();
  });
});
