#include<stdio.h>
#include<windows.h>

int runServer() {
    if(system("npm run dev") == 0) return 1;
    return 0;
}

int main() {
    if(!runServer()) {
        printf("Failed to run server\n");
        return 1;
    }
}