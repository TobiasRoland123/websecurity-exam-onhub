#!/bin/sh


echo "** RTE mode: $RTE"



case "$RTE" in
    dev)
        echo "=== Development Mode ==="
        npm run dev
        ;;
    test)
        echo "=== Test Mode ==="
        npm run start
        ;;
    prod)
        echo "=== Production Mode ==="
        npm run start                                                                                                     
        ;;
esac


