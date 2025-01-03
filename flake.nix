{
  description = "My development environment";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    templ.url = "github:a-h/templ?ref=v0.3.819";
  };
  outputs = {
    self,
    nixpkgs,
    ...
  } @ inputs: let
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
        f system pkgs);
    templ = system: inputs.templ.packages.${system}.templ;
  in {
    packages = forAllSystems (system: pkgs: let
      musl = pkgs.musl;
      derivation =
        pkgs.buildGoModule {
        };
    in {
      default = derivation;
    });

    devShells = forAllSystems (system: pkgs: {
      default = pkgs.mkShell {
        CGO_ENABLED = "0";
        hardeningDisable = ["all"];

        buildInputs = with pkgs; [
          # Javascript tools
          eslint_d
          nodejs_22
          nodePackages_latest.eslint

          # Go tools
          go
          gofumpt
          golangci-lint
          golines
          gotools
          delve
          (templ system)
          gopls

          # Sqlite tools
          sqlite
          lazysql
        ];
      };
    });
  };
}
