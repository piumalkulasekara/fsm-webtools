sequenceDiagram
    participant SU  as Super User
    participant NP  as New Portal
    participant IT  as IT Support
    participant IFS as IFS FSM
    SU->>NP: Create / Edit User Profile
    NP->>NP: Save Draft Profile
    NP->>IT: Submit Profile for Review
    NP->>IT: Notify IT Support of Pending Review
    IT->>NP: Review Draft Profile
    alt Profile Rejected
        NP->>SU: Notify Super User of Rejection
        SU->>SU: Review Rejection Comments
        SU->>NP: Edit & Resubmit Profile
        NP->>IT: Notify IT Support of Pending Review
        IT->>NP: Review Draft Profile
    else Profile Approved
        NP->>IFS: Publish Verified Request to IFS
        IFS->>NP: Send Success Confirmation to Portal
        NP->>SU: Notify Super User of Success
        NP->>IT: Notify IT Support of Success
    end
