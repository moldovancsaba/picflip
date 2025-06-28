export const setupPageTest = () => {
  // Mock next/navigation
  const router = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  };

  const resetMocks = () => {
    router.push.mockReset();
    router.replace.mockReset();
    router.back.mockReset();
  };

  return { router, resetMocks };
};
