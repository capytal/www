{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };
  outputs = {
    nixpkgs,
    self,
    ...
  }: let
    systems = [
      "x86_64-linux"
      "aarch64-linux"
      "x86_64-darwin"
      "aarch64-darwin"
    ];
    forAllSystems = f:
      nixpkgs.lib.genAttrs systems (system: let
        pkgs = import nixpkgs {inherit system;};
      in
        f pkgs);
  in {
    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShell {
        CGO_ENABLED = "0";
        hardeningDisable = ["all"];

        buildInputs = with pkgs; [
          # Go tools
          go
          golangci-lint
          gofumpt
          gotools
          delve

          # TailwindCSS
          tailwindcss_4
        ];
      };
    });
    packages = forAllSystems (pkgs: {
      default = self.packages.${pkgs.system}.capytalcc;
      capytalcc = pkgs.buildGoModule {
        name = "capytal.cc";
        pname = "capytal.cc";

        version = "0.1.0";

        src = ./.;

        nativeBuildInputs = with pkgs; [
          tailwindcss_4
        ];

        vendorHash = "sha256-aJK6vn76d1k9hWhUu+OBq3r9tM6uuqxAdDjiuwMOMTU=";

        preBuild = ''
          tailwindcss \
          	-i ./assets/stylesheets/tailwind.css \
          	-o ./assets/stylesheets/out.css \
          	--minify
        '';

        meta = {
          mainProgram = "capytal.cc";
        };
      };
    });
    nixosModules = {
      default = self.nixosModules.capytalcc;
      capytalcc = {
        config,
        lib,
        pkgs,
        ...
      }: let
        cfg = config.services.capytalcc.web;
      in {
        options.services.capytalcc.web = with lib;
        with lib.types; {
          enable = mkEnableOption "";
          port = mkOption {
            type = port;
            default = 7332;
          };
          package = mkOption {
            type = package;
            default = self.packages.${pkgs.system}.default;
          };
          user = mkOption {
            type = str;
            default = "capytalcc-web";
          };
          group = mkOption {
            type = str;
            default = cfg.user;
          };
        };
        config = with lib;
          mkIf cfg.enable {
            systemd.services."capytalcc-web" = {
              after = ["network.target"];
              wantedBy = ["multi-user.target"];
              serviceConfig = {
                Type = "simple";
                User = cfg.user;
                Group = cfg.group;
                ExecStart = "${lib.escapeShellArg (lib.getExe cfg.package)} -port ${toString cfg.port}";
                Restart = "on-success";
              };
            };

            users.users."${cfg.user}" = {
              isSystemUser = true;
              group = cfg.group;
            };
            users.groups."${cfg.group}" = {};
          };
      };
    };
  };
}
