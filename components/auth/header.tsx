const Header = ({ label }: { label: string }) => {
  return (
    <div className="w-full flex-col gap-y-4 items-center text-center">
      <h1 className="text-3xl font-semibold  drop-shadow-lg">
        Auth-Toolkit <span className="text-c-purple">🛠</span>
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default Header;
