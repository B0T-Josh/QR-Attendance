#include <stdio.h>
#include <windows.h>

int main(int argc, char *argv[]) {
    char command[256];
    sprintf(command, "git checkout %s", argv[1]);
    if(system(command) == 0) {
        return 0;
    } else {
        printf("Error: branch '%s' does not exist.\n", argv[1]);
        return 1;
    }
}