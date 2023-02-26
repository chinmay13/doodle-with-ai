import numpy as np
import cv2
from collections import deque

bpoints = [deque(maxlen=1024)]

# These indexes will be used to mark position
# of pointers in colour array
blue_index = 0

# The kernel to be used for dilation purpose
kernel = np.ones((5, 5), np.uint8)

# The colours which will be used as ink for
# the drawing purpose
colors = [(255, 0, 0)]
colorIndex = 0

# Loading the default webcam of PC.
cap = cv2.VideoCapture(0)

# set a variable to keep track of how many consecutive frames the pointer has not been detected
no_pointer_count = 0
# set the maximum number of consecutive frames the pointer can be not detected before stopping
max_no_pointer_count = 50
# Keep looping
while True:
    pointer_detected = False
    # Reading the frame from the camera
    ret, frame = cap.read()

    # Flipping the frame to see same side of yours
    frame = cv2.flip(frame, 1)
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    Lower_hsv = np.array([102, 107, 187])
    Upper_hsv = np.array([179, 255, 255])

    cv2.putText(frame, "CLEAR", (49, 33),
                cv2.FONT_HERSHEY_COMPLEX, 0.5,
                (255, 255, 255), 2, cv2.LINE_AA)

    # Identifying the pointer by making its
    # mask
    Mask = cv2.inRange(hsv, Lower_hsv, Upper_hsv)
    Mask = cv2.erode(Mask, kernel, iterations=1)
    Mask = cv2.morphologyEx(Mask, cv2.MORPH_OPEN, kernel)
    Mask = cv2.dilate(Mask, kernel, iterations=1)

    # Find contours for the pointer after
    # identifying it
    cnts, _ = cv2.findContours(Mask.copy(), cv2.RETR_EXTERNAL,
                               cv2.CHAIN_APPROX_SIMPLE)
    center = None

    # If the contours are formed
    if len(cnts) > 0:
        pointer_detected = True
        # sorting the contours to find biggest
        cnt = sorted(cnts, key=cv2.contourArea, reverse=True)[0]

        # Get the radius of the enclosing circle
        # around the found contour
        ((x, y), radius) = cv2.minEnclosingCircle(cnt)

        # Draw the circle around the contour
        cv2.circle(frame, (int(x), int(y)), int(radius), (0, 255, 255), 2)

        # Calculating the center of the detected contour
        M = cv2.moments(cnt)
        center = (int(M['m10'] / M['m00']), int(M['m01'] / M['m00']))

        # Now checking if the user wants to click on
        # any button above the screen
        if center[1] <= 65:
            # Clear Button
            if 40 <= center[0] <= 140:
                bpoints = [deque(maxlen=512)]
                blue_index = 0
        else:
            if colorIndex == 0:
                bpoints[blue_index].appendleft(center)

    # Append the next dequeue when nothing is
    # detected to avoid messing up
    else:
        bpoints.append(deque(maxlen=512))
        blue_index += 1

    # Draw lines of all the colors on the
    # canvas and frame
    points = [bpoints]
    for i in range(len(points)):
        for j in range(len(points[i])):
            for k in range(1, len(points[i][j])):
                if points[i][j][k - 1] is None or points[i][j][k] is None:
                    continue
                cv2.line(frame, points[i][j][k - 1], points[i][j][k], colors[i], 2)
                print(f"Current: {points[i][j][k]}, Previous: {points[i][j][k-1]}")
    # increment or reset the no_pointer_count depending on whether the pointer has been detected in the current
    # iteration
    if pointer_detected:
        no_pointer_count = 0
    else:
        no_pointer_count += 1

    # if the pointer has not been detected for the maximum number of frames, stop reading
    if no_pointer_count >= max_no_pointer_count:
        break
    # Show all the windows
    cv2.imshow("Tracking", frame)
    # If the 'q' key is pressed then stop the application
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# Release the camera and all resources
cap.release()
cv2.destroyAllWindows()
