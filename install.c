#include <stdio.h>
#include <string.h>
#include <windows.h>
#include <unistd.h>
#include <stdbool.h>

bool change(char *path);
bool run(char *command);
bool install(char *lang);
void print(char *msg);
bool printBool(char *msg, bool res);
bool start();

int main() {
    if(start()) {
        print("Installation successful");
        return 0;
    } else return printBool("Something went wrong", true);
}

bool start() {
    if(install("node")) {
        if(install("django")) {
            return true;
        } else return printBool("There is an error on installation of django", false);
    } else return printBool("There is an error on installation of node", false);
}

void print(char *msg) {
    printf("%s\n", msg);
}

bool printBool(char *msg, bool res) {
    print(("%s\n", msg));
    return res;
}

bool change(char *path) {
    if(chdir(path) == 0) return printBool(("%s", path), true);
    else return printBool(("%s", path), false);
}

bool run(char *command) {
    if(system(command) == 0) return printBool(("%s", command), true);
    else return printBool(("%s", command), false);
}

bool install(char *lang) {
    if(strcmp(lang, "node") == 0) {
        print("Node is installing");
        if(change("frontend")) {
            if(run("npm install")) {
                return printBool("Node installation successful", true);
            } else return printBool("There is an error on npm install", false);
        } else return printBool("There is an error on changing directory to frontend", false);
    } else if(strcmp(lang, "django") == 0) {
        if(change("..")){
            if(run("python -m venv env")) {
                if(run("env env")) {
                    if(change("backend")) {
                        if(run("pip install django")) {
                            if(run("python.exe -m pip install --upgrade pip")) {
                                return printBool("Installing Django succcessful", true);
                            } return printBool("There is an error upgrading pip", false);
                        } else return printBool("There is an error on installing Django", false);
                    } else return printBool("There is an error on changing directory to backend", false);
                } else return printBool("There is an error on activating virtual environment", false);
            } else return printBool("There is an error on making virtual environment", false);
        } else return printBool("There is an error on changin directory to root", false);
    } else return printBool("There is an error", false);
}

